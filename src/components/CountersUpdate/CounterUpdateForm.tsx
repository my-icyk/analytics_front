import { X } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Counter } from "../../types/counter"
import { counterUpdateFormSchema, CounterUpdateFormValues } from "./CounterUpdateForm.schema"

type CounterUpdateFormProps = {
  counter: Counter | null
  error: string
  onClose: () => void
  onSubmit: (values: CounterUpdateFormValues) => void
}

const emptyValues: CounterUpdateFormValues = { id_counter: 0, amount: 0, start_date: "", end_date: "", auto: false, comment: "" }

export function CounterUpdateForm({ counter, error, onClose, onSubmit }: CounterUpdateFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CounterUpdateFormValues>({
    resolver: zodResolver(counterUpdateFormSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    reset(counter ? {amount: counter.amount, start_date: counter.start_date, end_date: counter.end_date, auto: counter.auto, comment: counter.comment } : emptyValues)
  }, [counter, reset])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header"><h2>{counter ? "Edit counter" : "Create counter"}</h2><button className="icon-button" aria-label="Close" onClick={onClose}><X size={16} /></button></div>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>

          <label>Amount
            <input type="number" step="any" {...register("amount", { valueAsNumber: true })} />
            {errors.amount && <span className="auth-error">{errors.amount.message}</span>}
          </label>
          <label>Start date
            <input type="date" {...register("start_date")} />
            {errors.start_date && <span className="auth-error">{errors.start_date.message}</span>}
          </label>
          <label>End date
            <input type="date" {...register("end_date")} />
            {errors.end_date && <span className="auth-error">{errors.end_date.message}</span>}
          </label>
          <div className="toggle-row">
            <div className="toggle-row-text"><strong>Auto-update</strong><span>Let the backend update this counter automatically.</span></div>
            <label className="switch">
              <input type="checkbox" {...register("auto")} />
              <span className="switch-track"><span className="switch-thumb" /></span>
            </label>
          </div>
          <label>Comment
            <textarea className="comment-textarea" rows={4} {...register("comment")} placeholder="Add any notes about this counter..." />
            {errors.comment && <span className="auth-error">{errors.comment.message}</span>}
          </label>
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">{counter ? "Save changes" : "Create counter"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

