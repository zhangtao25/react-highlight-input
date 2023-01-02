import { useState } from 'react';

import HighlightInput from '../packages/HighlightInput';

const HOPP_ENVIRONMENT_REGEX = /\{\{(.+?)\}\}/g;

function App() {
  const [value, setValue] = useState('{{url}}/api/cov/calendar/{{id}}');
  const mockEnvironment = {
    name: 'dev',
    variables: [
      {
        key: 'url',
        value: 'http://10.5.153.1:8090',
      },
    ],
  };
  return (
    <div className="App">
      <div style={{ height: '30px' }}></div>
      <HighlightInput
        value={value}
        onChange={(v) => {
          setValue(v);
        }}
        highlight={{
          pattern: HOPP_ENVIRONMENT_REGEX,
          class: (match: any) => {
            if (
              mockEnvironment.variables
                .map((v) => v.key)
                .includes(match.replace('{{', '').replace('}}', ''))
            ) {
              return 'green';
            } else {
              return 'red';
            }
          },
          tooltip: (match: any) => {
            const key = match.replace('{{', '').replace('}}', '');
            const v = mockEnvironment.variables.find((v) => v.key === key);
            if (!v?.value) {
              return (
                <div>
                  {'Choose an Environment'}

                  <span
                    style={{
                      backgroundColor: 'rgb(184,187,192)',
                      padding: '0 4px',
                      marginLeft: '4px',
                      borderRadius: '2px',
                    }}
                  >
                    {'Not found'}
                  </span>
                </div>
              );
            } else {
              return (
                <div>
                  {mockEnvironment.name}
                  <span
                    style={{
                      backgroundColor: 'rgb(184,187,192)',
                      padding: '0 4px',
                      marginLeft: '4px',
                      borderRadius: '2px',
                    }}
                  >
                    {v?.value}
                  </span>
                </div>
              );
            }
          },
        }}
      />
    </div>
  );
}

export default App;
