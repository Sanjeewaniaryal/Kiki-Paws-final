import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Stripe and UploadThing call these server-to-server without a Clerk session;
// each route verifies the request itself.
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/privacy",
  "/terms",
  "/api/webhook(.*)",
  "/api/uploadthing(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
