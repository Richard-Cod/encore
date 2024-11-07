import { getdefaultValue } from "@/lib/utils";
import * as Yup from "yup";

class LoginVM {
  initialValues = {
    email: getdefaultValue("richardfreelance1@gmail.com"),
    password: getdefaultValue("Password123@?"),
  };

  loginSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string().required("Mot de passe requis"),
  });
}

class RegisterVM {
  initialValues = {
    email: getdefaultValue("richardfreelance1@gmail.com"),
    password: getdefaultValue("Password123@?"),
  };

  registerSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string().required("Mot de passe requis"),
  });
}

export { LoginVM, RegisterVM };
