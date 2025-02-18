"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormData, jobOptions, techOptions } from "@/types/form"
import { userSchema } from "@/validations/userSchema"
import { yupResolver } from "@hookform/resolvers/yup"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import ProgressBar from "./ProgressBar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select } from "./ui/select"

const steps = [
  { title: "Identité", description: "Vos informations personnelles" },
  { title: "Profil", description: "Description et URLs" },
  { title: "Expertise", description: "Job & Technologies" },
  { title: "Confirmation", description: "Vérification des informations" },
]
export default function MultiFormSteps() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const [selectedTech, setSelectedTech] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      job: "",
      technologies: [],
      description: "",
      url_github: "",
      url_youtube: "",
      url_site: "",
    },
  })

  useEffect(() => {
    const watchedTech = watch("technologies")
    if (watchedTech && watchedTech.length > 0 && selectedTech.length === 0) {
      setSelectedTech(watchedTech)
    }
  }, [watch, selectedTech])

  const validateStep = async (nextStep: number) => {
    let fieldsToValidate: (keyof FormData)[] = []
    switch (step) {
      case 1:
        fieldsToValidate = ["nom", "prenom", "email"]
        break
      case 2:
        fieldsToValidate = ["description"]
        break
      case 3:
        fieldsToValidate = ["job", "technologies"]
        break
    }
    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      setStep(nextStep)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    )
  }

  useEffect(() => {
    setValue("technologies", selectedTech)
  }, [selectedTech, setValue])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProgressBar currentStep={step} steps={steps} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <div className="space-y-4">
            <Input {...register("nom")} placeholder="Nom" />
            {errors.nom && <p className="text-red-500">{errors.nom.message}</p>}

            <Input {...register("prenom")} placeholder="Prenom" />
            {errors.prenom && (
              <p className="text-red-500">{errors.prenom.message}</p>
            )}

            <Input {...register("email")} placeholder="Email" />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <Button type="button" onClick={() => validateStep(2)}>
              Suivant
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded-md"
              placeholder="Description"
            />

            <Input {...register("url_github")} placeholder="URL Github" />
            <Input {...register("url_youtube")} placeholder="URL Youtube" />
            <Input {...register("url_site")} placeholder="URL Site" />

            <div className="flex gap-4">
              <Button type="button" onClick={() => validateStep(1)}>
                Précedent
              </Button>
              <Button type="button" onClick={() => validateStep(3)}>
                Suivant
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Select onValueChange={(value) => setValue("job", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre poste" />
              </SelectTrigger>
              <SelectContent>
                {jobOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.job && <p className="text-red-500">{errors.job.message}</p>}

            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    Sélectionner les technologies
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="space-y-2 p-4">
                    {techOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                        onClick={() => handleSelectTech(option.value)}
                      >
                        <Check
                          className={`h-4 w-4 ${
                            selectedTech.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2">
                {selectedTech.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleSelectTech(tech)}
                  >
                    {techOptions.find((t) => t.value === tech)?.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
            {errors.technologies && (
              <p className="text-red-500">{errors.technologies.message}</p>
            )}

            <div className="flex gap-4">
              <Button type="button" onClick={() => validateStep(2)}>
                Précédent
              </Button>
              <Button type="button" onClick={() => validateStep(4)}>
                Suivant
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Confirmez vos informations</h2>
            <div className="space-y-2">
              <p>Nom: {watch("nom")}</p>
              <p>Prenom: {watch("prenom")}</p>
              <p>Email: {watch("email")}</p>
              <p>Description: {watch("description")}</p>
              <p>Job: {watch("job")}</p>
              <p>
                Technologies:
                {selectedTech
                  .map(
                    (tech) => techOptions.find((t) => t.value === tech)?.label
                  )
                  .join(", ")}
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="button" onClick={() => validateStep(3)}>
                Précedent
              </Button>
              <Button type="submit">Confirmer</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
