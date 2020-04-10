import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {pink, indigo} from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: pink[500],
            light: '#e66465',
            dark: pink[700],
        },
        secondary: {
            main: indigo[500]
        }
    }
});

export default theme;