import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import LeadsPage from "@/pages/leads/index";
import LeadDetailPage from "@/pages/leads/detail";
import RunsPage from "@/pages/runs/index";
import RunDetailPage from "@/pages/runs/detail";
import SkillsPage from "@/pages/skills/index";
import SkillDetailPage from "@/pages/skills/detail";
import AgentsPage from "@/pages/agents/index";
import SettingsPage from "@/pages/settings/index";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "#ea580c",
    colorForeground: "#0a0a0a",
    colorMutedForeground: "#9a9490",
    colorDanger: "#dc2626",
    colorBackground: "#f0eeeb",
    colorInput: "#e5e2de",
    colorInputForeground: "#0a0a0a",
    colorNeutral: "#9a9490",
    fontFamily: "Inter, sans-serif",
    borderRadius: "2px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#fafaf8] rounded-none w-[440px] max-w-full overflow-hidden border border-[#c8c3bf]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none bg-[#f0eeeb] border-t border-[#c8c3bf]",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function ProtectedRoute({ component: Component }: { component: any }) {
  return (
    <>
      <Show when="signed-in">
        <Component />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />

          <Route path="/skills" component={SkillsPage} />
          <Route path="/skills/:slug" component={SkillDetailPage} />

          <Route path="/dashboard"><ProtectedRoute component={DashboardPage} /></Route>
          <Route path="/leads"><ProtectedRoute component={LeadsPage} /></Route>
          <Route path="/leads/:id"><ProtectedRoute component={LeadDetailPage} /></Route>
          <Route path="/runs"><ProtectedRoute component={RunsPage} /></Route>
          <Route path="/runs/:id"><ProtectedRoute component={RunDetailPage} /></Route>
          <Route path="/agents"><ProtectedRoute component={AgentsPage} /></Route>
          <Route path="/settings"><ProtectedRoute component={SettingsPage} /></Route>

          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  if (!clerkPubKey) {
    return <div>Missing VITE_CLERK_PUBLISHABLE_KEY</div>;
  }

  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
