import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

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
    } else {
      setCountries([])
    }
  }, [value])

  const handleClick = (countryName) => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
      .then(response => {
          setCountries([response.data])
          console.log(response.data.name.common)
      })
      .catch(error => {
        console.log(error)
      })
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
          </div>
        ))}
        </pre>}
    </div>
  )
}

export default App
