import { useState } from 'react';
import './App.css';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';

interface FootbolistForm {
  name: string;
  age: number;
  photo: FileList;
  team: string;
}

function App() {
  const { register, handleSubmit, watch } = useForm<FootbolistForm>();
  const [users, setUsers] = useState<FootbolistForm[]>([]);
  const submit: SubmitHandler<FootbolistForm> = (formData) => {
    const photoUrl = URL.createObjectURL(formData.photo[0]);
    const data = {
      name: formData.name,
      team: formData.team,
      age: formData.age,
      photo: photoUrl,
    };

    axios
      .post('http://localhost:3001/register', data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const photo = watch('photo');
  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка запроса:', error);
    }
  };

  return (
    <>
      <h1>Create Footbolist</h1>
      {users.map((user) => (
        <div className="footbolist__container">
          <h1>{user.name}</h1>
          <h2>{user.age}</h2>
          <h2>{user.team}</h2>
          <img
            style={{ height: '100px', width: '130px' }}
            src={user.photo}
          ></img>
        </div>
      ))}
      <form onSubmit={handleSubmit(submit)}>
        <input
          type="text"
          placeholder="Введите имя футболиста"
          {...register('name', { required: true })}
        />
        <input
          type="number"
          placeholder="Введите возраст футболиста"
          {...register('age', { required: true })}
        />
        <input
          type="text"
          placeholder="Введите команду футболиста"
          {...register('team', { required: true })}
        />
        <input
          type="file"
          placeholder="Загрузите фото"
          {...register('photo')}
        />
        <button>Отправить</button>
      </form>
      <button onClick={getUsers}>Получить футболистов</button>
    </>
  );
}

export default App;
