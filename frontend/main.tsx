import { createRoot } from 'react-dom/client';
import App from './App';
import { DemoSession } from './session';
import './theme.css';
import '../site/assets/brand-rose.css';
import '../site/assets/ios-interface.css';
import '../site/assets/janus-loader.css';
createRoot(document.getElementById('root')!).render(<DemoSession><App/></DemoSession>);
