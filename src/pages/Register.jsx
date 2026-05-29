import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import styles from '../styles/AuthPage.module.css';

function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const run = async () => {
      if (!values.name.trim()) {
        setError('Ingresa un nombre.');
        return;
      }

      if (!values.email.trim()) {
        setError('Ingresa un correo electrónico.');
        return;
      }

      if (!values.password || values.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      if (values.password !== values.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      const result = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        postalCode: values.postalCode.trim(),
        password: values.password,
      });

      if (!result.ok) {
        setError(result.error || 'No se pudo registrar el usuario.');
        return;
      }

      navigate('/user/profile', { replace: true });
    };

    run().catch((e) => setError(e?.message || 'No se pudo registrar el usuario.'));
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Semana 11</p>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>
          Registra un usuario local para mantener sesión, proteger rutas y asociar compras a tu
          perfil.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Nombre</span>
            <input
              className={styles.input}
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Ejemplo: Juan Pérez"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Correo electrónico</span>
            <input
              className={styles.input}
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="correo@dominio.com"
              type="email"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Teléfono</span>
            <input
              className={styles.input}
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="Ejemplo: 3001234567"
              type="tel"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Dirección</span>
            <input
              className={styles.input}
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="Calle 123 #45-67"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Ciudad</span>
            <input
              className={styles.input}
              name="city"
              value={values.city}
              onChange={handleChange}
              placeholder="Medellín"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Código postal</span>
            <input
              className={styles.input}
              name="postalCode"
              value={values.postalCode}
              onChange={handleChange}
              placeholder="050021"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Contraseña</span>
            <input
              className={styles.input}
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              type="password"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Confirmar contraseña</span>
            <input
              className={styles.input}
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              type="password"
            />
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button type="submit" className={styles.primaryButton}>
            Crear cuenta
          </button>
        </form>

        <p className={styles.helperText}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>.
        </p>
      </div>
    </section>
  );
}

export default Register;