const validateRut = (rut) => {
    if (!rut) {
      return 'El RUT es obligatorio';
    }
  
    const rutPattern = /^\d{7,8}-[0-9kK]{1}$/;
  
    if (!rutPattern.test(rut)) {
      return 'Por favor, ingresa un RUT válido (formato: 12345678-9)';
    }
  
    const cleanRut = rut.replace(/-/g, '').toUpperCase();
    const rutDigits = cleanRut.slice(0, -1);
    const expectedDigit = cleanRut.slice(-1);
    const calculatedDigit = calculateRutDigit(rutDigits);
  
    if (calculatedDigit !== expectedDigit) {
      return 'El dígito verificador del RUT no es válido';
    }
  
    return '';
  };
  
  const calculateRutDigit = (rut) => {
    let sum = 0;
    let multiplier = 2;
  
    for (let i = rut.length - 1; i >= 0; i--) {
      sum += parseInt(rut[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
  
    const remainder = sum % 11;
    const calculatedDigit = 11 - remainder;
  
    if (calculatedDigit === 11) {
      return '0';
    } else if (calculatedDigit === 10) {
      return 'K';
    } else {
      return calculatedDigit.toString();
    }
  };
  
  const validateForm = (formData, confirmEmail) => {
    let formIsValid = true;
    const newErrors = {};
  
    const rutValidationResult = validateRut(formData.rut);
    if (rutValidationResult !== '') {
      newErrors.rut = rutValidationResult;
      formIsValid = false;
    }
  
    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      formIsValid = false;
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Las contraseñas no coinciden';
      formIsValid = false;
    }
  
    if (formData.email !== confirmEmail) {
      newErrors.confirmEmail = 'Los emails no coinciden';
      formIsValid = false;
    }
  
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'El email no es válido';
      formIsValid = false;
    }
  
    return { formIsValid, errors: newErrors };
  };
  
  export { validateRut, validateForm };
  