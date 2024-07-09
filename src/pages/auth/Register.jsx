import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { checkTokenExpiration } from '../../middleware/middleware'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate();

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

  const checkValidation = async (e, field) => {
    e.preventDefault();
    if (field !== '') {
      let value;
      if (field == 'phone') {
        value = whatsapp;
      } else if (field == 'email') {
        value = email;
      }
      await axios.post('http://localhost:8000/api/beasiswa-ppo/check', {
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
              setEmailDisabled(true);
            }
          }
        })
        .catch((error) => {
          const responseError = error.response;
          console.log(responseError);
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
        });
    }
  }

  const registerHandle = async () => {
    if (whatsapp !== '' && email !== '' && name !== '') {
      const confirmed = confirm(`Berikut data yang akan didaftarkan\n------\nNama lengkap: ${name}\nEmail: ${email}\nNo. Whatsapp: ${whatsapp}\n------\nApakah sudah benar?`)
      if (confirmed) {
        await axios.post('http://localhost:8000/api/auth/beasiswappo/register', {
          phone: whatsapp,
          email: email,
          name: name,
        })
          .then((response) => {
            localStorage.setItem('LP3IPPO:token', response.data.access_token)
            alert(response.data.message);
            navigate('/dashboard');
          })
          .catch((error) => {
            console.log(error.response.data.message);
          });
      } else {
        setWhatsappDisabled(false);
        setEmailDisabled(false);
        setEmail("");
        setEmailShow(false);
      }
    } else {
      alert('Ada form yang belum diisi!');
    }
  }

  useEffect(() => {
    checkTokenExpiration()
      .then((response) => {
        if (!response.forbidden) {
          navigate('/dashboard');
        }
        console.log(response.message);
      })
      .catch((error) => {
        if (!error.forbidden) {
          navigate('/login');
        }
        console.log(error.message);
      })
  }, []);

  return (
    <div className='flex items-center justify-center bg-lp3i-300 h-screen'>
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
                <input type="number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="No. Whatsapp" required disabled={whatsappDisabled} />
                {
                  !whatsappDisabled &&
                  <button type="submit" className="text-white bg-lp3i-100 hover:bg-lp3i-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                }
              </div>
              {
                whatsappMessage ? (
                  whatsappValidate &&
                  <p className="mt-2 text-xs text-red-500">
                    <span className="font-medium">No. Whatsapp </span>
                    <span>sudah digunakan. Apakah anda </span>
                    <a href="https://wa.me?phone=6281286501015&text=resetpass" target='_blank' className='underline'>lupa kata sandi?</a>
                  </p>
                ) : null
              }
            </div>
          </form>
          {
            emailShow &&
            <form onSubmit={(e) => checkValidation(e, 'email')} method='POST'>
              <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
                  Email
                </label>
                <div className='flex gap-2'>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border-2 border-lp3i-100 outline-none text-gray-900 text-sm rounded-xl focus:none block w-full px-4 py-2.5" placeholder="Email" required disabled={emailDisabled} />
                  {
                    !emailDisabled &&
                    <button type="submit" className="text-white bg-lp3i-100 hover:bg-lp3i-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5">
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  }
                </div>
                {
                  emailMessage ? (
                    emailValidate &&
                    <p className="mt-2 text-xs text-red-500"><span className="font-medium">Email</span> sudah digunakan!</p>
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
                <FontAwesomeIcon icon={faArrowRight} />
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
    </div>
  )
}

export default Register