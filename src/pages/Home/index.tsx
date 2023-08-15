import { HandPalm, Play } from 'phosphor-react'
import { HomeContainer, StartDownButton, StopDownButton } from './styles'
import { useContext } from 'react'
import { NewCycleForm } from './NewCycleForm'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { Countdown } from './Countdown'
import { FormProvider, useForm } from 'react-hook-form'
import { CyclesContext } from '../../contexts/CyclesContext'

const newCycleFOrmValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no minimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFOrmValidationSchema>

export function Home() {
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFOrmValidationSchema),
    defaultValues: {
      minutesAmount: 0,
      task: '',
    },
  })

  const { createNewCycle, interruptCurrentCycle, activeCycle } =
    useContext(CyclesContext)

  const { watch, handleSubmit, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)

    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopDownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm />
            Começar
          </StopDownButton>
        ) : (
          <StartDownButton disabled={isSubmitDisabled} type="submit">
            <Play />
            Começar
          </StartDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
