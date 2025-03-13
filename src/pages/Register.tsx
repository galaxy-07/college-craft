
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const formSchema = z.object({
  displayName: z
    .string()
    .min(3, {
      message: "Display name must be at least 3 characters.",
    })
    .max(30, {
      message: "Display name must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  college: z
    .string()
    .min(1, { message: "Please select your college." }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const colleges = [
  "Stanford University",
  "MIT",
  "Harvard University",
  "Princeton University",
  "Yale University",
  "University of California, Berkeley",
  "University of Chicago",
  "Columbia University",
  "Northwestern University",
  "Other",
];

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      college: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would usually make a request to your authentication API
  }

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">
          Join the discussion with students from your college
        </p>
      </div>

      <Alert variant="default" className="bg-primary/10 border-primary/20">
        <AlertDescription className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4" />
          You'll need to verify your college email to join your campus group
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="JohnDoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="john.doe@university.edu" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="college"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your college" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline text-primary">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Register;
