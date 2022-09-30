import * as yup from "yup";
import { passwordNotLongEnough } from "../modules/user/register/errorMessages";

export const passwordValidation = yup
  .string()
  .min(6, passwordNotLongEnough)
  .max(255);
