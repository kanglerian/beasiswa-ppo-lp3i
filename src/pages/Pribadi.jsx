import React, { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { checkTokenExpiration } from '../middleware/middleware'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleDot, faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
import { getProvinces, getRegencies, getDistricts, getVillages } from '../utilities/StudentAddress.js'
import axios from 'axios';
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'
import ServerError from './errors/ServerError'

const Pribadi = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });

  const [errorPage, setErrorPage] = useState(false);

  const [editAddress, setEditAddress] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolsAPI, setSchoolsAPI] = useState([]);

  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    gender: '',
    place_of_birth: '',
    date_of_birth: '',
    religion: '',
    school: '',
    major: '',
    class: '',
    year: '',
    income_parent: '',
    social_media: '',
    province: '',
    regency: '',
    district: '',
    village: '',
    place: '',
    rt: '',
    rw: '',
    postal_code: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    nik: [],
    name: [],
    gender: [],
    placeOfBirth: [],
    dateOfBirth: [],
    religion: [],
    school: [],
    major: [],
    class: [],
    year: [],
    incomeParent: [],
    socialMedia: [],
    place: [],
    rt: [],
    rw: [],
    postalCode: [],
  });

  const getInfo = async () => {
    const token = localStorage.getItem('LP3IPPO:token');
    await axios.get('http://localhost:8000/api/beasiswappo/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setEditAddress(false);
        setFormData({
          nik: response.data.applicant.nik,
          name: response.data.applicant.name,
          gender: response.data.applicant.gender,
          place_of_birth: response.data.applicant.place_of_birth,
          date_of_birth: response.data.applicant.date_of_birth,
          religion: response.data.applicant.religion,
          major: response.data.applicant.major,
          class: response.data.applicant.class,
          year: response.data.applicant.year,
          income_parent: response.data.applicant.income_parent,
          social_media: response.data.applicant.social_media,
          school: response.data.applicant.school_id,
          address: response.data.applicant.address,
        });
        if (response.data.applicant.school_id) {
          setSelectedSchool({
            value: response.data.applicant.school_id,
            label: response.data.applicant.school
          });
        }
        if (!response.data.applicant.address) {
          setEditAddress(true);
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('LP3IPPO:token');
          navigate('/login')
        }
        if(error.response.status == 500){
          setErrorPage(true);
        }
      })
  }

  const getSchools = async () => {
    await axios
      .get(`http://localhost:8000/api/school/getall`)
      .then((res) => {
        let bucket = [];
        let dataSchools = res.data.schools;
        dataSchools.forEach((data) => {
          bucket.push({
            value: data.id,
            label: data.name,
          });
        });
        setSchoolsAPI(bucket);
      })
      .catch((err) => {
        let networkError = err.message == "Network Error";
        if (networkError) {
          alert("Mohon maaf, data sekolah tidak bisa muncul. Periksa server.");
        } else {
          console.log(err.message);
        }
      });
  };

  const schoolHandle = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        school: selectedOption.value
      });
      setSelectedSchool(selectedOption);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const saveHandle = async (e) => {
    e.preventDefault();
    await axios.patch(`http://localhost:8000/api/beasiswappo/applicant/update/${user.identity}`, formData)
      .then((response) => {
        getInfo();
        alert(response.data.message);
      })
      .catch((error) => {
        if (error.response.status == 422) {
          const nikError = error.response.data.message.nik || [];
          const nameError = error.response.data.message.name || [];
          const genderError = error.response.data.message.gender || [];
          const placeOfBirthError = error.response.data.message.place_of_birth || [];
          const dateOfBirthError = error.response.data.message.date_of_birth || [];
          const religionError = error.response.data.message.religion || [];
          const schoolError = error.response.data.message.school || [];
          const majorError = error.response.data.message.major || [];
          const classError = error.response.data.message.class || [];
          const yearError = error.response.data.message.year || [];
          const incomeParentError = error.response.data.message.income_parent || [];
          const socialMediaError = error.response.data.message.social_media || [];
          const placeError = error.response.data.message.place || [];
          const rtError = error.response.data.message.rt || [];
          const rwError = error.response.data.message.rw || [];
          const postalCodeError = error.response.data.message.postal_code || [];
          const newAllErrors = {
            nik: nikError,
            name: nameError,
            gender: genderError,
            placeOfBirth: placeOfBirthError,
            dateOfBirth: dateOfBirthError,
            religion: religionError,
            school: schoolError,
            major: majorError,
            class: classError,
            year: yearError,
            incomeParent: incomeParentError,
            socialMedia: socialMediaError,
            place: placeError,
            rt: rtError,
            rw: rwError,
            postalCode: postalCodeError,
          };
          setErrors(newAllErrors);
          alert('Silahkan periksa kembali form yang telah diisi, ada kesalahan pengisian.');
        }
      })
  }

  useEffect(() => {
    checkTokenExpiration()
      .then((response) => {
        if (response.forbidden) {
          return navigate('/login');
        }
        setUser(response.data);
        getInfo();
        getSchools();
        getProvinces()
          .then((response) => {
            setProvinces(response);
          })
          .catch(error => console.log(error));
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
      <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5'>
        <form onSubmit={saveHandle} className='max-w-5xl w-full mx-auto shadow-xl'>
          <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
            <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Kembali</span>
            </Link>
            <h2 className='text-white text-center font-bold space-x-2'>
              <FontAwesomeIcon icon={faCircleDot} />
              <span>Data Pribadi</span>
            </h2>
            <div className='flex justify-center md:justify-end'>
              <img src={LogoLP3IPutih} alt="" width={150} />
            </div>
          </header>
          <div className='bg-white px-8 py-10 rounded-b-2xl'>
            <div className='space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div>
                  <label htmlFor="nik" className="block mb-2 text-sm font-medium text-gray-900">Nomor Induk Kependudukan</label>
                  <input type="number" id="nik" value={formData.nik} name='nik' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Nomor induk kependudukan" required />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.nik.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.nik.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nama lengkap</label>
                  <input type="text" id="name" value={formData.name} maxLength={150} name='name' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Nama lengkap" required />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.name.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.name.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">Jenis Kelamin</label>
                  <select id="gender" name='gender' value={formData.gender} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                    <option value="">Pilih</option>
                    <option value="1">Laki-laki</option>
                    <option value="0">Perempuan</option>
                  </select>
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.gender.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.gender.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="place_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tempat lahir</label>
                  <input type="text" id="place_of_birth" maxLength={150} value={formData.place_of_birth} name='place_of_birth' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tempat lahir" required />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.placeOfBirth.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.placeOfBirth.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="date_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tanggal lahir</label>
                  <input type="date" id="date_of_birth" value={formData.date_of_birth} name='date_of_birth' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tanggal lahir" required />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.dateOfBirth.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.dateOfBirth.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Agama</label>
                  <select id="religion" value={formData.religion} name='religion' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                    <option value="">Pilih</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.religion.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.religion.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="school" className="block mb-2 text-sm font-medium text-gray-900">Sekolah</label>
                  <CreatableSelect
                    options={schoolsAPI}
                    value={selectedSchool}
                    onChange={schoolHandle}
                    placeholder="Pilih sekolah"
                    className="text-sm"
                    required
                  />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.school.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.school.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="major" className="block mb-2 text-sm font-medium text-gray-900">Jurusan</label>
                  <input type="text" id="major" value={formData.major} maxLength={100} name='major' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Jurusan" required />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.major.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.major.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">Kelas</label>
                  <input type="text" id="class" value={formData.class} maxLength={100} name='class' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Kelas" required />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.class.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.class.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900">Tahun lulus</label>
                  <input type="number" id="year" value={formData.year} name='year' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tahun lulus" required />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.year.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.year.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="income_parent" className="block mb-2 text-sm font-medium text-gray-900">Penghasilan Orangtua</label>
                  <select id="income_parent" value={formData.income_parent} name='income_parent' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                    <option value="">Pilih</option>
                    <option value="< 1.000.000">&lt; 1.000.000</option>
                    <option value="1.000.000 - 2.000.000">1.000.000 - 2.000.000</option>
                    <option value="2.000.000 - 4.000.000">2.000.000 - 4.000.000</option>
                    <option value="> 5.000.000">&gt; 5.000.000</option>
                  </select>
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.incomeParent.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.incomeParent.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
                <div>
                  <label htmlFor="social_media" className="block mb-2 text-sm font-medium text-gray-900">Akun sosial media</label>
                  <input type="text" id="social_media" value={formData.social_media} maxLength={35} name='social_media' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="@" required />
                  <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                    {
                      errors.socialMedia.length > 0 &&
                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {errors.socialMedia.map((error, index) => (
                          <li className="font-regular" key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                  </ul>
                </div>
              </div>
              <hr />
              {
                !editAddress ? (
                  <div className='space-y-1'>
                    <h3 className='font-bold'>Alamat:</h3>
                    <p className='text-sm text-gray-800 space-x-2 leading-6'>
                      <span>{formData.address}</span>
                      <button type='button' onClick={() => setEditAddress(!editAddress)} className='text-amber-500 hover:text-amber-600'>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label htmlFor="provinces" className="block mb-2 text-sm font-medium text-gray-900">Provinsi</label>
                      <select id="provinces" onChange={(e) => {
                        setFormData({
                          ...formData,
                          province: e.target.value
                        });
                        getRegencies(e.target.options[e.target.selectedIndex].dataset.id)
                          .then((response) => {
                            setRegencies(response)
                          })
                          .catch((error) => {
                            console.log(error);
                          })
                      }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                        <option value="">Pilih Provinsi</option>
                        {
                          provinces.length > 0 && (
                            provinces.map((province) =>
                              <option key={province.id} data-id={province.id} value={province.name}>{province.name}</option>
                            )
                          )
                        }
                      </select>
                    </div>
                    <div>
                      <label htmlFor="regencies" className="block mb-2 text-sm font-medium text-gray-900">Kota/Kabupaten</label>
                      <select id="regencies" onChange={(e) => {
                        setFormData({
                          ...formData,
                          regency: e.target.value
                        });
                        getDistricts(e.target.options[e.target.selectedIndex].dataset.id)
                          .then((response) => {
                            setDistricts(response)
                          })
                          .catch((error) => {
                            console.log(error);
                          })
                      }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required disabled={regencies.length === 0}>
                        <option value="">Pilih Kota / Kabupaten</option>
                        {
                          regencies.length > 0 ? (
                            regencies.map((regency) =>
                              <option key={regency.id} data-id={regency.id} value={regency.name}>{regency.name}</option>
                            )
                          ) : (
                            <option value="">Pilih Kota / Kabupaten</option>
                          )
                        }
                      </select>
                    </div>
                    <div>
                      <label htmlFor="disctricts" className="block mb-2 text-sm font-medium text-gray-900">Kecamatan</label>
                      <select id="disctricts" onChange={(e) => {
                        setFormData({
                          ...formData,
                          district: e.target.value
                        });
                        getVillages(e.target.options[e.target.selectedIndex].dataset.id)
                          .then((response) => {
                            setVillages(response)
                          })
                          .catch((error) => {
                            console.log(error);
                          })
                      }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required disabled={districts.length === 0}>
                        <option value="">Pilih Kecamatan</option>
                        {
                          districts.length > 0 ? (
                            districts.map((district) =>
                              <option key={district.id} data-id={district.id} value={district.name}>{district.name}</option>
                            )
                          ) : (
                            <option value="">Pilih Kecamatan</option>
                          )
                        }
                      </select>
                    </div>
                    <div>
                      <label htmlFor="villages" className="block mb-2 text-sm font-medium text-gray-900">Kelurahan</label>
                      <select id="villages" onChange={(e) => {
                        setFormData({
                          ...formData,
                          village: e.target.value
                        });
                      }} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required disabled={villages.length === 0}>
                        <option value="">Pilih Desa / Kelurahan</option>
                        {
                          villages.length > 0 ? (
                            villages.map((village) =>
                              <option key={village.id} data-id={village.id} value={village.name}>{village.name}</option>
                            )
                          ) : (
                            <option value="">Pilih Desa / Kelurahan</option>
                          )
                        }
                      </select>
                    </div>
                    <div>
                      <label htmlFor="place" className="block mb-2 text-sm font-medium text-gray-900">Jl/Kp/Perum</label>
                      <input type="text" id="place" value={formData.place} maxLength={150} name='place' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Jl/Kp/Perum" required />

                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.place.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.place.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="rt" className="block mb-2 text-sm font-medium text-gray-900">RT.</label>
                      <input type="number" id="rt" value={formData.rt} name='rt' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RT." required />

                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.rt.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.rt.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="rw" className="block mb-2 text-sm font-medium text-gray-900">RW.</label>
                      <input type="number" id="rw" value={formData.rw} name='rw' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RW." required />

                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.rw.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.rw.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                    <div>
                      <label htmlFor="postal_code" className="block mb-2 text-sm font-medium text-gray-900">Kode pos</label>
                      <input type="number" id="postal_code" value={formData.postal_code} name='postal_code' onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Kode pos" required />

                      <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                        {
                          errors.postalCode.length > 0 &&
                          <ul className="ml-2 mt-2 text-xs text-red-600 list-disc">
                            {errors.postalCode.map((error, index) => (
                              <li className="font-regular" key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                      </ul>
                    </div>
                  </div>
                )
              }
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
}

export default Pribadi