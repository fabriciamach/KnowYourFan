import { useForm } from 'react-hook-form';

export const useBasicInfoForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return {
    register,
    handleSubmit,
    errors
  };
};