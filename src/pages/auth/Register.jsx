import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import LogoLP3IPutih from '../../assets/logo-lp3i-putih.svg'
import LogoTagline from '../../assets/tagline-warna.png'
import LoadingScreen from '../LoadingScreen'
import ServerError from '../errors/ServerError'

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [errorPage, setErrorPage] = useState(false);

  const [presenters, setPresenters] = useState([]);

  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappDisabled, setWhatsappDisabled] = useState(false);
  const [whatsappValidate, setWhatsappValidate] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState(false);

  const [email, setEmail] = useState("");
  const [emailShow, setEmailShow] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [emailValidate, setEmailValidate] = useState(false);
  const [emailMessage, setEmailMessage] = useState(false);

  const [name, setName] = useState("");
  const [information, setInformation] = useState("6281313608558");

  const setValidatePhone = (inputPhone) => {
    let formattedPhone = inputPhone.trim();
    if (formattedPhone.length <= 14) {
      if (formattedPhone.startsWith("62")) {
        if (formattedPhone.length === 3 && (formattedPhone[2] === "0" || formattedPhone[2] !== "8")) {
          setWhatsapp('62');
        } else {
          setWhatsapp(formattedPhone);
        }
      } else if (formattedPhone.startsWith("0")) {
        setWhatsapp('62' + formattedPhone.substring(1));
      } else {
        setWhatsapp('62');
      }
    }
  };

  const checkValidation = async (e, field) => {
    e.preventDefault();
    setLoading(true);
    if (field !== '') {
      let value;
      if (field == 'phone') {
        if (whatsapp.length < 12) {
          return alert('Nomor telpon tidak valid, check jumlah nomor!');
        }
        value = whatsapp;
      } else if (field == 'email') {
        value = email;
      }
      await axios.post('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/validation', {
        value: value,
        field: field
      })
        .then((response) => {
          if (response.status == 200) {
            if (field == 'phone') {
              setWhatsappMessage(true);
              setWhatsappValidate(true);
              if (response.data.create) {
                setWhatsappDisabled(true);
                setEmailShow(true);
              }
            } else if (field == 'email') {
              setEmailMessage(true);
              setEmailValidate(true);
              if (response.data.create) {
                setEmailDisabled(true);
              }
            }
          }
          setLoading(false);
        })
        .catch((error) => {
          const responseError = error.response;
          if (responseError.status == 404 && responseError.data.create) {
            if (field == 'phone') {
              setWhatsappMessage(true);
              setWhatsappValidate(false);
              setWhatsappDisabled(true);
              setEmailShow(true);
              if (responseError.data.data) {
                setName(responseError.data.data.name);
                setEmail(responseError.data.data.email);
              }
            } else if (field == 'email') {
              setEmailMessage(true);
              setEmailValidate(false);
              setEmailDisabled(true);
              if (responseError.data.data) {
                setName(responseError.data.data.name);
                setWhatsapp(responseError.data.data.phone);
              }
            }
          }
          setLoading(false);
        });
    }
  }

  const registerHandle = async () => {
    setLoading(true);
    if (whatsapp !== '' && email !== '' && name !== '' && information !== '') {
      const confirmed = confirm(`Berikut data yang akan didaftarkan\n------\nNama lengkap: ${name}\nEmail: ${email}\nNo. Whatsapp: ${whatsapp}\n------\nApakah sudah benar?`)
      if (confirmed) {
        await axios.post('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/register/v1', {
          phone: whatsapp,
          email: email,
          name: name,
          information: information
        }, {
          withCredentials: true
        })
          .then((response) => {
            localStorage.setItem('LP3IPPO:token', response.data.token)
            setLoading(false);
            alert(response.data.message);
            navigate('/dashboard');
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        setWhatsappDisabled(false);
        setEmailDisabled(false);
        setEmail("");
        setEmailShow(false);
      }
    } else {
      setLoading(false);
      alert('Ada form yang belum diisi!');
    }
  }

  const getPresenters = async () => {
    await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/pmb/presenters`)
      .then((response) => {
        setPresenters(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getInfo = async () => {
    try {
      const token = localStorage.getItem('LP3ITGB:token');
      if (!token) {
        return navigate('/');
      }

      const fetchProfile = async (token) => {
        const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/profiles/v1', {
          headers: { Authorization: token },
          withCredentials: true,
        });
        return response.data;
      };

      try {
        const profileData = await fetchProfile(token);
        if (profileData) {
          navigate('/dashboard');
        }
      } catch (profileError) {
        if (profileError.response && profileError.response.status === 403) {
          try {
            const response = await axios.get('https://api.politekniklp3i-tasikmalaya.ac.id/pmb/auth/token/v2', {
              withCredentials: true,
            });

            const newToken = response.data;
            localStorage.setItem('LP3ITGB:token', newToken);
            const newProfileData = await fetchProfile(newToken);
            if (newProfileData) {
              navigate('/dashboard');
            }
          } catch (error) {
            console.error('Error refreshing token or fetching profile:', error);
            if (error.response && error.response.status === 400) {
              localStorage.removeItem('LP3ITGB:token');
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
          setErrorPage(true);
        }
      }
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem('LP3ITGB:token');
          navigate('/');
        } else {
          console.error('Unexpected HTTP error:', error);
          setErrorPage(true);
        }
      } else if (error.request) {
        console.error('Network error:', error);
        setErrorPage(true);
      } else {
        console.error('Error:', error);
        setErrorPage(true);
      }
      navigate('/');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    getInfo();
    getPresenters();
  }, []);

  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 h-screen p-5 space-y-4'>
          <nav className='flex items-center gap-3 py-3'>
            <img src={LogoLP3IPutih} alt="" width={180} />
            <img src={LogoTagline} alt="" width={110} />
          </nav>
          <div className='max-w-lg w-full bg-white p-10 rounded-3xl shadow-xl space-y-6'>
            <div className="space-y-4">
              <form onSubmit={(e) => checkValidation(e, 'phone')} method='POST' className='space-y-4'>
                <div>
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
                    Nama lengkap
                  </label>
                  <div className='flex gap-2'>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="Tulis nama lengkap anda..." required />
                  </div>
                </div>
                <div>
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
                    No. Whatsapp
                  </label>
                  <div className='flex gap-2'>
                    <input type="number" value={whatsapp} onChange={(e) => setValidatePhone(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="No. Whatsapp" required disabled={whatsappDisabled} />
                    {
                      !whatsappDisabled &&
                      <button type="submit" className="text-white bg-lp3i-100 hover:bg-lp3i-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5">
                        {
                          loading ? (
                            <div role="status">
                              <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                              </svg>
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            <FontAwesomeIcon icon={faSearch} />
                          )
                        }
                      </button>
                    }
                  </div>
                  {
                    whatsappMessage ? (
                      whatsappValidate &&
                      <p className="mt-2 text-xs text-red-500">
                        <span className="font-medium">No. Whatsapp </span>
                        <span>sudah digunakan. Apakah anda </span>
                        <a href="https://wa.me?phone=6282219509698&text=Kirim%20pesan%20perintah%20ini%20untuk%20reset%20password%20:resetpass:" target='_blank' className='underline'>lupa kata sandi?</a>
                      </p>
                    ) : null
                  }
                </div>
              </form>
              {
                emailShow &&
                <form onSubmit={(e) => checkValidation(e, 'email')} method='POST' className='space-y-4'>
                  <div>
                    <label htmlFor="information" className="block mb-2 text-sm font-medium text-gray-900">Sumber Informasi</label>
                    <select id="information" defaultValue={information} onChange={(e) => setInformation(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3" required>
                      <option disabled>Pilih</option>
                      <option value="6281313608558">Website</option>
                      {
                        presenters.length > 0 &&
                        presenters.map((presenter, index) =>
                          <option value={presenter.phone} key={index}>{presenter.name}</option>
                        )
                      }
                    </select>
                  </div>
                  <div>
                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <div className='flex gap-2'>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="Email" required disabled={emailDisabled} />
                      {
                        !emailDisabled &&
                        <button type="submit" className="text-white bg-lp3i-100 hover:bg-lp3i-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5">
                          {
                            loading ? (
                              <div role="status">
                                <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                              </div>
                            ) : (
                              <FontAwesomeIcon icon={faSearch} />
                            )
                          }
                        </button>
                      }
                    </div>
                    {
                      emailMessage ? (
                        emailValidate &&
                        <p className="mt-2 text-xs text-red-500"><span className="font-medium">Email</span> sudah digunakan! silahkan masukan email lainnya.</p>
                      ) : null
                    }
                  </div>
                </form>
              }
            </div>
            <div className='flex items-center gap-3'>
              {
                whatsappDisabled && emailDisabled && (
                  <button type="button" onClick={registerHandle} className="text-white bg-lp3i-200 hover:bg-lp3i-300  font-medium rounded-xl text-sm px-5 py-2.5 text-center inline-flex items-center gap-2">
                    <span>Lanjutkan</span>
                    {
                      loading ? (
                        <div role="status">
                          <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <FontAwesomeIcon icon={faArrowRight} />
                      )
                    }
                  </button>
                )
              }
              {
                !whatsappDisabled && !emailDisabled && (
                  <Link to={`/login`} className="text-gray-700 font-medium rounded-xl text-sm text-center">
                    <span>Sudah punya akun? </span>
                    <span className='underline font-semibold'>Masuk disini</span>
                  </Link>
                )
              }
            </div>
          </div>
        </main>
      )
    )
  );
}

export default Register