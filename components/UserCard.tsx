"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserDto } from "@/models/User";
import { Trash, Edit } from "lucide-react";
import { deleteUserAction } from "@/actions/users";
import { toast } from "sonner";
import UserForm from "./UserForm";
import { useState } from "react";

export default function UserCard({ user }: { user: UserDto }) {
  const [open, setOpen] = useState(false);

  const handleDeleteUser = async () => {
    const res = await deleteUserAction(user._id);

    if ("error" in res) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.address}</CardDescription>
        <CardAction className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline">
                <Edit />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update User</DialogTitle>
              </DialogHeader>
              <UserForm action="update" userId={user._id} onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button size="icon" variant="destructive" onClick={handleDeleteUser}>
            <Trash />
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
