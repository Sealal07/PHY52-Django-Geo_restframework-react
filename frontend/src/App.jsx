import { useState, useEffect } from "react";
import './App.css';

const API_BASE_URL = 'http://localhost:8000/api';

function App(){
  const [points, setPoints] = useState([]);
  const [selectedPointId, setSelectedPointId] = useState('');

  const [userLat, setUserLat] = useState(59.9387);
  const [userLng, setUserLng] = useState(30.3149);

  const [calculationResult, setCalculationResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(()=>{
    fetch(`${API_BASE_URL}/points/`)
    .then((res) => {
      if (!res.ok) throw new Error('Ошибка загрузки списка ПВЗ');
      return res.json()
    })
    .then((data)=>{
      setPoints(data);
      if (data.length > 0){
        setSelectedPointId(data[0].id);//ПВЗ по умолчанию
      }
    })
    .catch((err)=> setError(err.message));
  }, []);

  // запрос на расчет стоимости
  const handleCalculate = (e) =>{
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      "user_lat": parseFloat(userLat),
      "user_lng": parseFloat(userLng),
      "point_id": parseInt(selectedPointId)
    };

    fetch(`${API_BASE_URL}/calculate-shipping/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then((res)=>{
      if (!res.ok) throw new Error('Ошибка при расчете доставки');
      return res.json()
    })
    .then((data)=>{
      setCalculationResult(data);
      setLoading(false);
    })
    .catch((err)=> {
      setError(err.message);
      setLoading(false);
    })
  }

  return (
    <div className="container">
      <h1>📍Pickup Point Distance</h1>
      {error && 
        <div className="error-banner">
          {error}
        </div>
      }
      <div className="grid">
      {/* ЛЕВАЯ ПАНЕЛЬ НАСТРОЙКИ */}
        <div className="card">
          <h2>Настройки доставки</h2>
          <form onSubmit={handleCalculate}>
            <div className="form-group">
              <label>Выберите ПВЗ:</label>
              <select value={selectedPointId}
              onChange={(e)=>setSelectedPointId(e.target.value)}>
                {points.map((pt)=>(
                  <option key={pt.id} value={pt.id}>
                    {pt.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ваша широта:</label>
              <input type="number" 
                    step='0.0001'
                    value={userLat}
                    onChange={(e)=>setUserLat(e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Ваша долгота:</label>
              <input type="number" 
                    step='0.0001'
                    value={userLng}
                    onChange={(e)=>setUserLng(e.target.value)}/>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Считаем...' : 'Рассчитать доставку'}
            </button>
          </form>
        </div>
        {/* ПРАВАЯ ПАНЕЛЬ ИТОГ */}
        <div className="card card-result">
          <h2>Результат расчета:</h2>
          {calculationResult ? (
            <div className="resul-details">
              <p><b>Пункт:</b> {calculationResult.point_name}</p>
              <div className="metric">
                <span>Расстояние: </span>
                <b>{calculationResult.distance_km}</b>
              </div>
              <div className="metric">
                <span>Итоговая цена: </span>
                <b>{calculationResult.delivery_price}</b>
              </div>
            </div>
          ) : (
          <p className="placeholder">
            Заполните координаты и нажмите кнопку расчета
          </p>
        ) }
        </div>
      </div>
    </div>
  );
}

export default App;