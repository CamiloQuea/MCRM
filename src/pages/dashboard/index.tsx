import { Button } from "@/modules/common/components/ui/button";
import { useToast } from "@/modules/common/components/ui/use-toast";
import { DashboardShell } from "@/modules/common/layout/DashboardShell";
import React from "react";

const Index = () => {
  const { toast } = useToast();
  return (
    <DashboardShell>
      <Button
      className="w-20"
        onClick={() =>
          toast({
            title: "Test",
            // variant:'destructive',
            // className: "bg-red-500 w-20",
           
          })
        }
      >
        Test
      </Button>
    </DashboardShell>
  );
};

export default Index;
