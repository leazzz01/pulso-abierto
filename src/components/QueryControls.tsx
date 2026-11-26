import { useState } from 'react';
import type { FormEvent } from 'react';
import { querySchema } from '../schemas/querySchema';
import type { QueryValues } from '../schemas/querySchema';

interface QueryControlsProps {
  values: QueryValues;
  onChange: (values: QueryValues) => void;
  onSubmit: (values: QueryValues) => void;
  loading: boolean;
}

export function QueryControls({ values, onChange, onSubmit, loading }: QueryControlsProps) {
  const [submitted, setSubmitted] = useState(false);
  const validation = querySchema.safeParse(values);
  const errors = submitted && !validation.success ? validation.error.flatten().fieldErrors : {};

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const result = querySchema.safeParse(values);
    if (result.success) onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>Consultar el mercado</legend>
        <div className="controls">
          <div className="field">
            <label htmlFor="search">Nombre o símbolo</label>
            <input id="search" type="search" value={values.search} placeholder="Ej. Bitcoin o BTC"
              onChange={(event) => onChange({ ...values, search: event.target.value })}
              aria-invalid={Boolean(errors.search)} aria-describedby="search-help" />
            <small id="search-help">{errors.search?.[0] ?? 'Opcional: escribe al menos 2 caracteres.'}</small>
          </div>
          <div className="field">
            <label htmlFor="currency">Moneda</label>
            <select id="currency" value={values.currency}
              onChange={(event) => {
                const result = querySchema.shape.currency.safeParse(event.target.value);
                if (result.success) onChange({ ...values, currency: result.data });
              }}
              aria-invalid={Boolean(errors.currency)} aria-describedby={errors.currency ? 'currency-error' : undefined}>
              <option value="usd">Dólar estadounidense (USD)</option>
              <option value="eur">Euro (EUR)</option>
              <option value="ars">Peso argentino (ARS)</option>
            </select>
            {errors.currency && <small id="currency-error">{errors.currency[0]}</small>}
          </div>
          <label className="checkbox">
            <input type="checkbox" checked={values.favoritesOnly}
              onChange={(event) => onChange({ ...values, favoritesOnly: event.target.checked })} />
            Solo favoritos
          </label>
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Consultando…' : 'Consultar cotizaciones'}
        </button>
      </fieldset>
    </form>
  );
}
