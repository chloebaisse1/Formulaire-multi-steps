import * as Yup from "yup"

export const userSchema = Yup.object().shape({
  nom: Yup.string().required("Le nom est obligatoire"),
  prenom: Yup.string().required("Le prénom est obligatoire"),
  email: Yup.string()
    .email("Email invalide")
    .required("L'email est obligatoire"),
  description: Yup.string().required("La description est obligatoire"),
  url_github: Yup.string().url("Url invalide").optional(),
  url_youtube: Yup.string().url("Url invalide").optional(),
  url_site: Yup.string().url("Url invalide").optional(),
  job: Yup.string().required("Le job est obligatoire"),
  technologies: Yup.array()
    .of(Yup.string().defined())
    .required("Les technologies sont obligatoires")
    .min(1, "Il faut au moins une technologie")
    .transform((value) => value.filters(Boolean)),
})
