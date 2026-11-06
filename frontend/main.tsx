import { createRoot } from 'react-dom/client';
import App from './App';
import { DemoSession } from './session';
import './theme.css';
createRoot(document.getElementById('root')!).render(<DemoSession><App/></DemoSession>);
