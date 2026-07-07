import { Suspense } from "react";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import { getTasks, getUserTasks } from "@/dal/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignoutButton from "@/components/signout-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckSquare } from "lucide-react";

async function Dashboard({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const resolvedSearchParams = await searchParams;
  const showMyTasks = resolvedSearchParams.filter === "my" && !!session?.user;

  const { docs: tasks } = showMyTasks ? await getUserTasks(session.user.id) : await getTasks();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <CheckSquare className="size-6" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pr-4 border-r">
                  <Avatar size="lg">
                    {session.user.image && (
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                        width={32}
                        height={32}
                      />
                    )}
                    <AvatarFallback className="text-xs">
                      {session.user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline-block">
                    {session.user.name}
                  </span>
                </div>
                <SignoutButton variant="destructive" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Tasks Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-heading">Tasks</h2>
                <p className="text-muted-foreground text-sm">
                  Manage your task list and view assignments
                </p>
              </div>

              {session?.user && (
                <div className="flex gap-1 bg-muted p-2 rounded-lg text-sm self-start sm:self-auto">
                  <Button
                    variant={!showMyTasks ? "default" : "outline"}
                    size="sm"
                    asChild
                    className="h-8 rounded-md px-3"
                  >
                    <Link href="/">All Tasks</Link>
                  </Button>
                  <Button
                    variant={showMyTasks ? "default" : "outline"}
                    size="sm"
                    asChild
                    className="h-8 rounded-md px-3"
                  >
                    <Link href="/?filter=my">My Tasks</Link>
                  </Button>
                </div>
              )}
            </div>

            {tasks.length === 0 ? (
              <div className="border border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="bg-muted p-4 rounded-full text-muted-foreground mb-4">
                  <CheckSquare className="size-8" />
                </div>
                <h3 className="font-semibold text-lg">No tasks yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  Create a new task to get started. Tasks are associated with their creator.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Creation Section */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div>
              <h2 className="text-2xl font-bold font-heading">Create Task</h2>
              <p className="text-muted-foreground text-sm">
                Add a new task to the collaborative board
              </p>
            </div>

            {session?.user ? (
              <div className="p-6 rounded-2xl bg-card border shadow-sm">
                <TaskForm action="create" />
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-card border border-primary/20  text-center space-y-4">
                <h3 className="font-semibold">Join the team</h3>
                <p className="text-sm text-muted-foreground">
                  You need to be signed in to create, update, or delete tasks.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <Button asChild className="w-full">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background text-foreground">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium animate-pulse">Loading dashboard...</span>
          </div>
        </div>
      }
    >
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}
