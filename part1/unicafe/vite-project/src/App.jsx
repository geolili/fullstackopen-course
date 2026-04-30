import { useState } from 'react'

const Statistics = ({ good, bad, neutral, total }) => {
  return (
    total > 0 ? <>
      <h2>Statistics</h2>
        <table>

          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={total}/>
          <StatisticLine text="average" value={(good-bad)/total}/>
          <StatisticLine text="postitive" value={good > 0 ? (good/total)*100 + ' %' : ''}/>
        </table>
    </> : <div>No feedback given</div>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <>
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    </>
  )

}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  function handleClickGood(e) {
    setGood(good+1);
    setTotal(good+bad+neutral+1);
  }

  function handleClickNeutral(e) {
    setNeutral(neutral+1);
    setTotal(good+bad+neutral+1);
  }

  function handleClickBad(e) {
    setBad(bad+1);
    setTotal(good+bad+neutral+1);
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <button onClick={handleClickGood}>good</button>
        <button onClick={handleClickNeutral}>neutral</button>
        <button onClick={handleClickBad}>bad</button>
      </div>
      <Statistics good={good} bad={bad} neutral={neutral} total={total}/>
    </div>
  )
}

export default App