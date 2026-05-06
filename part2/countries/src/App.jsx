import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [meteo, setMeteo] = useState({})

  //to refactor in more components like phonebook

  useEffect(() => {
    if (value.trim() !== "") {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const data = response.data
          const filtered = data.filter((country) =>
            country.name.common
            .toLowerCase()
            .startsWith(value.toLocaleLowerCase())
          )
          setCountries(filtered)
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      setCountries([])
    }
  }, [value])

  const handleClick =  async (countryName) => {
    try {
      const api_key = import.meta.env.VITE_SOME_KEY

      const responseCountry = await axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)

      const country = responseCountry.data
      setCountries([country])

      const capital = country.capital[0]
      console.log(capital)

      const weatherRes = await axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)

      setMeteo(weatherRes.data)

    } catch (error) {
      console.log("Something went wrong:", error)
    }
  }

  return (
    <div>
      <form>
        find countries: <input value={value} onChange={(e) => setValue(e.target.value)} />
      </form>
      {countries.length > 10 && <p>Too many matches, specify another filter</p>}
      {countries.length <= 10 && countries.length > 1 && <pre>
        {countries.map((country) => (
          <div key={country.cca3}>
            <span >{country.name.common}</span>
            <button style={{marginLeft: '10px'}} type="button" onClick={() => handleClick(country.name.common)}>Show</button>
          </div>
        ))}
      </pre>}
      {countries.length === 1 && <pre>
        {countries.map((country) => (
          <div key={country.cca3}>
            <h1 >{country.name.common}</h1>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>
            <h1>Languages</h1>
            <ul>
              {Object.entries(country.languages).map(([code, language]) => (
                <li key={code}>{language}</li>
              ))}
            </ul>
            <img style={{border: '1px solid black'}} src={country.flags.png} alt={country.flags.alt} />
            <h1>Weather in {country.capital}</h1>
            <p>Temperature: {meteo.main.temp} C°</p>
            <img src={`https://openweathermap.org/payload/api/media/file/${meteo.weather[0].icon}.png`} />
            <p>Wind: {meteo.wind.speed} m/s</p>
          </div>
        ))}
        </pre>}
    </div>
  )
}

export default App
