import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import MovieManager from './components/MovieManager';

export default function App() {
  return (
    <Provider store={store}>
      <MovieManager />
    </Provider>
  );
}
