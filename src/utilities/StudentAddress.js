import axios from "axios";

export const getProvinces = () => {
  return new Promise( async (resolve, reject) => {
    await axios.get('/api/provinces.json')
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export const getRegencies = (id) => {
  return new Promise( async (resolve, reject) => {
    await axios.get(`/api/regencies/${id}.json`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export const getDistricts = (id) => {
  return new Promise( async (resolve, reject) => {
    await axios.get(`/api/districts/${id}.json`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export const getVillages = (id) => {
  return new Promise( async (resolve, reject) => {
    await axios.get(`/api/villages/${id}.json`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}