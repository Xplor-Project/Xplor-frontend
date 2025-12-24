import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get('access');
    const refresh = params.get('refresh');

    if (access && refresh) {
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      navigate('/dashboard');
    } else {
      alert('Token not found in URL');
      navigate('/');
    }
  }, []);

  return <div className="text-center mt-20">Processing login...</div>;
};

export default Callback;
