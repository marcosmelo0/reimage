"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z
        .string({
            required_error: "O email é obrigatório.",
        })
        .email({
            message: "Email invalido.",
        }),
    password: z
        .string({
            required_error: "A senha é obrigatória.",
        })
        .min(7, {
            message: "A senha deve conter pelo menos 7 caracteres.",
        })
        .max(120, {
            message: "A senha não pode ter mais de 120 caracteres.",
        }),
});

export function CreateAccountForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const supabase = createClientComponentClient();
            const { email, password } = values;

            const {
                error,
                data: { user },
            } = await supabase.auth.signUp({
                email,
                password,
              /*   options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                } */
            });

            if (user) {
                form.reset();
                /* router.push("/"); */
                router.refresh()
            }
        } catch (error) {
            console.log("CreateAccountForm", error);
        } finally {
        }
    };

    return (
        <div className="flex flex-col justify-center items-center space-y-2">
            <span className="text-lg">Crie sua conta é rápido e prático :)</span>
            <Form {...form}>
                <form
                    className="flex flex-col space-y-2"
                    onSubmit={form.handleSubmit(onSubmit)} >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input
                                        className="focus-visible:ring-transparent"
                                        placeholder="Digite seu e-mail"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    <FormMessage />
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input
                                        className="focus-visible:ring-transparent"
                                        placeholder="Digite sua senha"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    <FormMessage />
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Criar conta</Button>
                </form>
            </Form>
        </div>
    );
}
