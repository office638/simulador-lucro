import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { TechnicalConfig, inverterBrands, solarModuleBrands, mountTypes } from '../types/form';
import { Loader2, Zap, DollarSign as Solar, Wrench, Calendar } from 'lucide-react';

const schema = z.object({
  inverter1: z.object({
    brand: z.string().min(1, 'Selecione uma marca'),
    power: z.number().min(0.1).max(100),
    quantity: z.number().min(1).max(99),
    warrantyPeriod: z.number().min(1).max(25)
  }),
  inverter2: z.object({
    brand: z.string(),
    power: z.number().min(0.1).max(100).optional(),
    quantity: z.number().min(1).max(99).optional(),
    warrantyPeriod: z.number().min(1).max(25).optional()
  }).optional(),
  solarModules: z.object({
    brand: z.string().min(1, 'Selecione uma marca'),
    power: z.number().min(100).max(800),
    quantity: z.number().min(1).max(999)
  }),
  installationType: z.enum(['Ground', 'Roof', 'Other']),
  otherTypeDescription: z.string().optional(),
  installationDays: z.number().min(1, 'Mínimo de 1 dia').max(365, 'Máximo de 365 dias')
});

export default function TechnicalConfigForm() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showInverter2, setShowInverter2] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<TechnicalConfig>({
    resolver: zodResolver(schema),
    defaultValues: formProgress.data.technicalConfig
  });

  const installationType = watch('installationType');

  const onSubmit = async (data: TechnicalConfig) => {
    try {
      setIsSubmitting(true);
      
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'financial-terms',
        completedSteps: [...prev.completedSteps, 'technical-config'],
        data: {
          ...prev.data,
          technicalConfig: data
        }
      }));
    } catch (error) {
      console.error('Error saving technical config:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuração Técnica do Sistema</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Primary Inverter */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Inversor Principal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fabricante
              </label>
              <select
                {...register('inverter1.brand')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o fabricante</option>
                {inverterBrands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {errors.inverter1?.brand && (
                <p className="text-red-500 text-sm">{errors.inverter1.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Potência (kW)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('inverter1.power', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.inverter1?.power && (
                <p className="text-red-500 text-sm">{errors.inverter1.power.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                {...register('inverter1.quantity', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.inverter1?.quantity && (
                <p className="text-red-500 text-sm">{errors.inverter1.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Garantia (anos)
              </label>
              <input
                type="number"
                {...register('inverter1.warrantyPeriod', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.inverter1?.warrantyPeriod && (
                <p className="text-red-500 text-sm">{errors.inverter1.warrantyPeriod.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Inverter Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showInverter2"
            checked={showInverter2}
            onChange={(e) => setShowInverter2(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="showInverter2" className="text-sm font-medium text-gray-700">
            Adicionar inversor secundário
          </label>
        </div>

        {/* Secondary Inverter */}
        {showInverter2 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Inversor Secundário
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fabricante
                </label>
                <select
                  {...register('inverter2.brand')}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione o fabricante</option>
                  {inverterBrands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Potência (kW)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('inverter2.power', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  {...register('inverter2.quantity', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Garantia (anos)
                </label>
                <input
                  type="number"
                  {...register('inverter2.warrantyPeriod', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Solar Modules */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Solar className="w-5 h-5 mr-2" />
            Módulos Solares
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fabricante
              </label>
              <select
                {...register('solarModules.brand')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o fabricante</option>
                {solarModuleBrands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {errors.solarModules?.brand && (
                <p className="text-red-500 text-sm">{errors.solarModules.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Potência (W)
              </label>
              <input
                type="number"
                {...register('solarModules.power', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.solarModules?.power && (
                <p className="text-red-500 text-sm">{errors.solarModules.power.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                {...register('solarModules.quantity', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.solarModules?.quantity && (
                <p className="text-red-500 text-sm">{errors.solarModules.quantity.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Installation Type */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            Tipo de Instalação
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                {...register('installationType')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o tipo</option>
                {mountTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.installationType && (
                <p className="text-red-500 text-sm">{errors.installationType.message}</p>
              )}
            </div>

            {installationType === 'Other' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição do tipo de instalação
                </label>
                <input
                  type="text"
                  {...register('otherTypeDescription')}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva o tipo de instalação"
                />
                {errors.otherTypeDescription && (
                  <p className="text-red-500 text-sm">{errors.otherTypeDescription.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Installation Days */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Prazo de Instalação
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Dias para Instalação
            </label>
            <input
              type="number"
              {...register('installationDays', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Número de dias"
            />
            {errors.installationDays && (
              <p className="text-red-500 text-sm">{errors.installationDays.message}</p>
            )}
          </div>
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