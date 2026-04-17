"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            <FileQuestion className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold">404</CardTitle>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Page Not Found
            </h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for something specific?
            </p>
            <Button
              onClick={() => router.push("/dashboard/products")}
              variant="ghost"
              size="sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}