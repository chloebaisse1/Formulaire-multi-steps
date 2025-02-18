"use client"

import { FormData } from "@/types/form"
import { userSchema } from "@/validations/userSchema"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import ProgressBar from "./ProgressBar"

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

  const validationStep = async (nextStep: number) => {
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
    </div>
  )
}
