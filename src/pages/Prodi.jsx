import React, { useEffect, useState } from 'react'
import { checkTokenExpiration } from '../middleware/middleware'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleDot, faSave } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import ServerError from './errors/ServerError'
import LoadingScreen from './LoadingScreen'

const Prodi = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  const [errorPage, setErrorPage] = useState(false);

  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program: '',
    program_second: '',
  });

  const [errors, setErrors] = useState({
    program: [],
    programSecond: [],
  });

  const getInfo = async () => {
    const token = localStorage.getItem('LP3IPPO:token');
    setLoading(true);
    await axios.get('https://database.politekniklp3i-tasikmalaya.ac.id/api/beasiswappo/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setFormData({
          program: response.data.applicant.program,
          program_second: response.data.applicant.program_second,
        });
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('LP3IPPO:token');
          navigate('/login')
        }
        if (error.response.status == 500) {
          setErrorPage(true);
        }
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const saveHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({
      program: [],
      programSecond: [],
    });
    try {
      await axios.patch(`https://database.politekniklp3i-tasikmalaya.ac.id/api/beasiswappo/applicant/update-prodi/${user.identity}`, formData);
      getInfo();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      alert('Data program studi berhasil diperbarui!');
    } catch (error) {
      if (error.response.status == 422) {
        const programError = error.response.data.message.program || [];
        const programSecondError = error.response.data.message.program_second || [];
        const newAllErrors = {
          program: programError,
          programSecond: programSecondError,
        };
        setErrors(newAllErrors);
        setLoading(false);
        alert('Silahkan periksa kembali form yang telah diisi, ada kesalahan pengisian.');
      }
    }
  }

  const getPrograms = async () => {
    await axios
      .get(`https://dashboard.politekniklp3i-tasikmalaya.ac.id/api/programs`)
      .then((res) => {
        let programsData = res.data;
        let results = programsData.filter((program) => program.regular == "1" && (program.campus == 'Kampus Tasikmalaya' || program.campus == 'LP3I Tasikmalaya'));
        setPrograms(results);
      })
      .catch((err) => {
        console.log(err);
        let networkError = err.message == "Network Error";
        if (networkError) {
          alert("Mohon maaf, data sekolah tidak bisa muncul. Periksa server.");
        } else {
          console.log(err.message);
        }
      });
  };

  useEffect(() => {
    checkTokenExpiration()
      .then((response) => {
        if (response.forbidden) {
          return navigate('/login');
        }
        setUser(response.data);
        getInfo();
        getPrograms();
      })
      .catch((error) => {
        if (error.forbidden) {
          return navigate('/login');
        }
      })
  }, []);
  return (
    errorPage ? (
      <ServerError />
    ) : (
      loading ? (
        <LoadingScreen />
      ) : (
        <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5 h-screen'>
          <form onSubmit={saveHandle} className='max-w-5xl w-full mx-auto shadow-xl'>
            <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
              <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Kembali</span>
              </Link>
              <h2 className='text-white text-center font-bold space-x-2'>
                <FontAwesomeIcon icon={faCircleDot} />
                <span>Data Program Studi</span>
              </h2>
              <div className='flex justify-center md:justify-end'>
                <img src={LogoLP3IPutih} alt="" width={150} />
              </div>
            </header>
            <div className='bg-white px-8 py-10 rounded-b-2xl'>
              <div className='space-y-5'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="program" className="block mb-2 text-sm font-medium text-gray-900">Program Studi 1</label>
                    <select id="program" name='program' value={formData.program} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="">Pilih</option>
                      {programs.length > 0 &&
                        programs.map((program) => (
                          <optgroup
                            label={`${program.level} ${program.title} - ${program.campus}`}
                            key={program.uuid}
                          >
                            {program.interest.length > 0 &&
                              program.interest.map((inter, index) => (
                                <option
                                  value={`${program.level} ${program.title}`}
                                  key={index}
                                >
                                  {inter.name}
                                </option>
                              ))}
                          </optgroup>
                        ))}
                    </select>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.program.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.program.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                  <div>
                    <label htmlFor="program_second" className="block mb-2 text-sm font-medium text-gray-900">Program Studi 2</label>
                    <select id="program_second" name='program_second' value={formData.program_second} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                      <option value="">Pilih</option>
                      {programs.length > 0 &&
                        programs.map((program) => (
                          <optgroup
                            label={`${program.level} ${program.title} - ${program.campus}`}
                            key={program.uuid}
                          >
                            {program.interest.length > 0 &&
                              program.interest.map((inter, index) => (
                                <option
                                  value={`${program.level} ${program.title}`}
                                  key={index}
                                >
                                  {inter.name}
                                </option>
                              ))}
                          </optgroup>
                        ))}
                    </select>
                    <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                      {
                        errors.programSecond.length > 0 &&
                        <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                          {errors.programSecond.map((error, index) => (
                            <li className="font-regular" key={index}>{error}</li>
                          ))}
                        </ul>
                      }
                    </ul>
                  </div>
                </div>
                <hr />
                <button type="submit" className="text-white bg-lp3i-200 hover:bg-lp3i-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
                  <FontAwesomeIcon icon={faSave} />
                  <span>Simpan perubahan</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      )
    )
  )
}

export default Prodi