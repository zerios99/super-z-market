import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-4">
        <div>
          <Button variant="elevated">im a button</Button>
        </div>
        <div>
          <Input placeholder="inter anything" />
        </div>
        <div>
          <Textarea placeholder="im a textarea" />
        </div>
        <div>
          <Progress value={50} />
        </div>
        <div>
          <Checkbox />
        </div>
      </div>
    </div>
  );
}
