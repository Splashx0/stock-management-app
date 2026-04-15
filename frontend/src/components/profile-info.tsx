import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export function ProfileInfo() {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="https://cdn.pixabay.com/photo/2014/06/16/23/39/black-370118_960_720.png"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full"
              >
                <Camera className="h-3.5 w-3.5" />
                <span className="sr-only">Change avatar</span>
              </Button>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold">Mohamed ali</h2>
              <p className="text-sm text-muted-foreground">
                mohamed.ali@example.com{" "}
              </p>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>
          {/* <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline">Edit Profile</Button>
            <Button>Change Password</Button>
          </div>*/}
        </div>
      </CardContent>
    </Card>
  );
}
