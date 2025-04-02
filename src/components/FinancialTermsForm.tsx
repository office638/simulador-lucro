import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { PaymentMethod, paymentMethods } from '../types/form';
import { DollarSign, CalendarDays, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const schema = z.object({
  installments: z.array(z.object({
    method: z.enum(['Transfer', 'BankSlip', 'Pix', 'Financing'] as const),
    amount: z.number().min(0),
    dueDate: z.date()
  })).min(1, 'Adicione pelo menos uma parcela'),
  totalAmount: z.number().min(0)
});

type FinancialTermsFormData = z.infer<typeof schema>;

export default function FinancialTermsForm() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<FinancialTermsFormData>({
    resolver: zodResolver(schema),
    defaultValues: formProgress.data.financialTerms || {
      installments: [{ method: 'Transfer', amount: 0, dueDate: new Date() }],
      totalAmount: 0
    }
  });

  const installments = watch('installments');

  // Initialize form with existing data
  useEffect(() => {
    if (formProgress.data.financialTerms) {
      reset(formProgress.data.financialTerms);
    }
  }, [formProgress.data.financialTerms, reset]);

  // Automatically calculate total amount when installments change
  useEffect(() => {
    const total = installments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
    setValue('totalAmount', total);
  }, [installments, setValue]);

  const addInstallment = () => {
    setValue('installments', [
      ...installments,
      { method: 'Transfer', amount: 0, dueDate: new Date() }
    ]);
  };

  const removeInstallment = (index: number) => {
    const newInstallments = installments.filter((_, i) => i !== index);
    setValue('installments', newInstallments);
  };

  const onSubmit = async (data: FinancialTermsFormData) => {
    try {
      setIsSubmitting(true);
      
      // Ensure all amounts are numbers
      const processedData = {
        ...data,
        installments: data.installments.map(inst => ({
          ...inst,
          amount: Number(inst.amount)
        })),
        totalAmount: Number(data.totalAmount)
      };
      
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'review',
        completedSteps: [...prev.completedSteps, 'financial-terms'],
        data: {
          ...prev.data,
          financialTerms: processedData
        }
      }));
    } catch (error) {
      console.error('Error saving financial terms:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Termos Financeiros</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Parcelas
          </h3>

          <div className="space-y-4">
            {installments.map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Método de Pagamento
                    </label>
                    <select
                      {...register(`installments.${index}.method`)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Valor
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`installments.${index}.amount`, { 
                          valueAsNumber: true,
                          onChange: (e) => {
                            const value = parseFloat(e.target.value);
                            setValue(`installments.${index}.amount`, isNaN(value) ? 0 : value);
                          }
                        })}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <CalendarDays size={18} className="mr-2" />
                      Data de Vencimento
                    </label>
                    <DatePicker
                      selected={installments[index].dueDate}
                      onChange={(date) => setValue(`installments.${index}.dueDate`, date as Date)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeInstallment(index)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    Remover Parcela
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addInstallment}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              + Adicionar Parcela
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Valor Total
          </h3>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">R$</span>
            <input
              type="number"
              step="0.01"
              {...register('totalAmount', { valueAsNumber: true })}
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
              readOnly
            />
          </div>
          {errors.totalAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.totalAmount.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Próximo'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}