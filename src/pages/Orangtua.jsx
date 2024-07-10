import React, { useEffect, useState } from 'react'
import { checkTokenExpiration } from '../middleware/middleware';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleDot, faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import LogoLP3IPutih from '../assets/logo-lp3i-putih.svg'

const Orangtua = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Loading...'
  });
  const [applicant, setApplicant] = useState({});
  const [father, setFather] = useState({});
  const [mother, setMother] = useState({});
  const [files, setFiles] = useState([]);

  const getInfo = async () => {
    const token = localStorage.getItem('LP3IPPO:token');
    await axios.get('http://localhost:8000/api/auth/beasiswappo/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setApplicant(response.data.applicant);
        setFather(response.data.father);
        setMother(response.data.mother);
        setFiles(response.data.files);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem('LP3IPPO:token');
          navigate('/login')
        }
      })
  }

  const logoutHandle = async () => {
    const token = localStorage.getItem('LP3IPPO:token');
    await axios.get('http://localhost:8000/api/auth/beasiswappo/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        localStorage.removeItem('LP3IPPO:token');
        navigate('/login')
      })
      .catch((error) => {
        console.log(error);
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
      })
      .catch((error) => {
        if (error.forbidden) {
          return navigate('/login');
        }
      })
  }, []);
  return (
    <main className='flex flex-col items-center justify-center bg-gradient-to-b from-lp3i-400 via-lp3i-200 to-lp3i-400 py-10 px-5 md:p-10'>
      <section className='w-full mx-auto shadow-xl'>
        <header className='grid grid-cols-1 md:grid-cols-3 items-center gap-5 bg-lp3i-500 px-10 py-6 rounded-t-2xl'>
          <Link to={'/dashboard'} className='text-white hover:text-gray-200 text-center md:text-left text-sm space-x-2'>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Kembali</span>
          </Link>
          <h2 className='text-white text-center font-bold space-x-2'>
            <FontAwesomeIcon icon={faCircleDot} />
            <span>Data Diri Orang Tua</span>
          </h2>
          <div className='flex justify-center md:justify-end'>
            <img src={LogoLP3IPutih} alt="" width={150} />
          </div>
        </header>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 bg-white px-8 py-10'>
          <div className='space-y-5'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nama lengkap</label>
                <input type="text" id="name" value={applicant.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Nama lengkap" required />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Pekerjaan</label>
                <input type="text" id="name" value={applicant.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Pekerjaan" required />
              </div>
              <div>
                <label htmlFor="place_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tempat lahir</label>
                <input type="text" id="place_of_birth" value={applicant.place_of_birth} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tempat lahir" required />
              </div>
              <div>
                <label htmlFor="date_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tanggal lahir</label>
                <input type="date" id="date_of_birth" value={applicant.date_of_birth} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tanggal lahir" required />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Pendidikan terakhir</label>
                <input type="text" id="name" value={applicant.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Pendidikan terakhir" required />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">No. Telpon</label>
                <input type="number" id="name" value={applicant.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="No. Telpon" required />
              </div>
            </div>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Provinsi</label>
                <select id="religion" defaultValue={applicant.religion} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="Provinsi">Provinsi</option>
                </select>
              </div>
              <div>
                <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Kota/Kabupaten</label>
                <select id="religion" defaultValue={applicant.religion} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="Kota/Kabupaten">Kota/Kabupaten</option>
                </select>
              </div>
              <div>
                <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Kecamatan</label>
                <select id="religion" defaultValue={applicant.religion} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="Kecamatan">Kecamatan</option>
                </select>
              </div>
              <div>
                <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Kelurahan</label>
                <select id="religion" defaultValue={applicant.religion} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="Kelurahan">Kelurahan</option>
                </select>
              </div>
              <div>
                <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">Jl/Kp/Perum</label>
                <input type="text" id="class" value={applicant.class} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Jl/Kp/Perum" required />
              </div>
              <div>
                <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">RT.</label>
                <input type="number" id="class" value={applicant.class} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RT." required />
              </div>
              <div>
                <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">RW.</label>
                <input type="number" id="class" value={applicant.class} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RW." required />
              </div>
              <div>
                <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">Kode pos</label>
                <input type="number" id="class" value={applicant.class} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Kode pos" required />
              </div>
            </div>
            <hr />
            <div className='space-y-1'>
              <h3 className='font-bold'>Alamat:</h3>
              <p className='text-sm text-gray-800 space-x-2 leading-6'>
                <span>Kp Palendah, RT. 03 RW. 01, Desa/Kelurahan Paledah, Kecamatan Padaherang, Kota/Kabupaten Kabupaten Pangandaran, Provinsi Jawa Barat, Kode Pos 46384</span>
                <button type='button' className='text-amber-500 hover:text-amber-600'>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </p>
            </div>
          </div>
          <div className='space-y-5'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nama lengkap</label>
                <input type="text" id="name" value={applicant.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Nama lengkap" required />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Pekerjaan</label>
                <input type="text" id="name" value={applicant.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Pekerjaan" required />
              </div>
              <div>
                <label htmlFor="place_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tempat lahir</label>
                <input type="text" id="place_of_birth" value={applicant.place_of_birth} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tempat lahir" required />
              </div>
              <div>
                <label htmlFor="date_of_birth" className="block mb-2 text-sm font-medium text-gray-900">Tanggal lahir</label>
                <input type="date" id="date_of_birth" value={applicant.date_of_birth} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Tanggal lahir" required />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Pendidikan terakhir</label>
                <input type="text" id="name" value={applicant.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Pendidikan terakhir" required />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">No. Telpon</label>
                <input type="number" id="name" value={applicant.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="No. Telpon" required />
              </div>
            </div>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Provinsi</label>
                <select id="religion" defaultValue={applicant.religion} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="Provinsi">Provinsi</option>
                </select>
              </div>
              <div>
                <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Kota/Kabupaten</label>
                <select id="religion" defaultValue={applicant.religion} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="Kota/Kabupaten">Kota/Kabupaten</option>
                </select>
              </div>
              <div>
                <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Kecamatan</label>
                <select id="religion" defaultValue={applicant.religion} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="Kecamatan">Kecamatan</option>
                </select>
              </div>
              <div>
                <label htmlFor="religion" className="block mb-2 text-sm font-medium text-gray-900">Kelurahan</label>
                <select id="religion" defaultValue={applicant.religion} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option disabled>Pilih</option>
                  <option value="Kelurahan">Kelurahan</option>
                </select>
              </div>
              <div>
                <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">Jl/Kp/Perum</label>
                <input type="text" id="class" value={applicant.class} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Jl/Kp/Perum" required />
              </div>
              <div>
                <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">RT.</label>
                <input type="number" id="class" value={applicant.class} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RT." required />
              </div>
              <div>
                <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">RW.</label>
                <input type="number" id="class" value={applicant.class} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="RW." required />
              </div>
              <div>
                <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900">Kode pos</label>
                <input type="number" id="class" value={applicant.class} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 p-2.5" placeholder="Kode pos" required />
              </div>
            </div>
            <hr />
            <div className='space-y-1'>
              <h3 className='font-bold'>Alamat:</h3>
              <p className='text-sm text-gray-800 space-x-2 leading-6'>
                <span>Kp Palendah, RT. 03 RW. 01, Desa/Kelurahan Paledah, Kecamatan Padaherang, Kota/Kabupaten Kabupaten Pangandaran, Provinsi Jawa Barat, Kode Pos 46384</span>
                <button type='button' className='text-amber-500 hover:text-amber-600'>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white px-8 pb-8 rounded-b-3xl'>
          <button type="button" class="text-white bg-lp3i-200 hover:bg-lp3i-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2">
            <FontAwesomeIcon icon={faSave} />
            <span>Simpan perubahan</span>
          </button>
        </div>
      </section>
    </main>
  )
}

export default Orangtua