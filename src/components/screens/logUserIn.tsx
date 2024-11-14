"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import AppFormikInput from "@/components/self/AppFormikInput";
import { Button } from "../ui/button";
import { credentialsList } from "@/constants";
import { authActions } from "@/logic/redux/reducers/auth";
import { useAppDispatch } from "@/logic/redux/hooks";

interface LoginPayload {
  username: string;
  password: string;
}

const initialValues: LoginPayload = {
  username: "",
  password: "",
};

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LogUserInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const disptach = useAppDispatch();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (formValues) => {
      const userExists = credentialsList.some(
        (user) =>
          user.username.toLowerCase() === formValues.username.toLowerCase() &&
          user.password === formValues.password
      );

      if (userExists) {
        disptach(
          authActions.setOrbiUser({
            username: formValues.username,
            password: formValues.password,
          })
        );

        // Si l'utilisateur existe, redirection
        router.push("/"); // Remplacez "/dashboard" par la route de destination
      } else {
        // Si l'utilisateur n'est pas trouvé, affichage d'une erreur
        setError("Invalid username or password");
      }
    },
  });

  return (
    <div
      className="w-full flex flex-col mx-auto items-center"
      data-testid="login-form"
    >
      <form onSubmit={formik.handleSubmit} className="w-full">
        <div className="flex flex-col w-full gap-y-4">
          <AppFormikInput
            placeholder="Ex: john1234"
            name="username"
            type="text"
            required
            data-testid="username-input"
            formik={formik}
            label="Username"
          />
          <AppFormikInput
            placeholder=""
            name="password"
            type="password"
            required
            data-testid="password-input"
            formik={formik}
            label="Password"
          />
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <Button
          type="submit"
          data-testid="login-button"
          className="w-full mt-6"
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LogUserInForm;
