# react-requests-hook

A react hook library help you manage your api requests in componment. 

## Example
![alt text](https://github.com/akishichinibu/react-requests-hook/raw/main/doc/images/example_1.gif "Example 1")

https://react-requests-hook-example.akishichinibu9502.workers.dev/

```jsx
import { configUseRequest, axiosPreset } from "react-hook-requests";

// Create an axios instance, and config it as what you want, like baseUrl, credential, error handler, etc
const a = axios.create();
// Use the axios preset for restful api requests using the prepared axios instance
configUseRequest(axiosPreset(a));

const ApiListDemo: FC = () => {
  const [state, dispatcher] = useReducer(reducer, null, () => ({
    userId: null,
    offset: null,
    limit: null,
  }));

  const buildRequestUrl = useCallback(() => {
    const query = Object.entries(state).filter(([_, v]) => v !== null).map(([k, v]) => `${k}=${v}`).join("&");

    let url = "/api/posts";

    if (query.length > 0) {
      url += `?${query}`;
    }

    return url;
  }, [state]);

  const listRequestUrl = buildRequestUrl();

  // Create a pend request here
  const { payload, progress, isLoading, refresh } = useGet<Post[]>({ initialUrl: listRequestUrl });

  return (
    <section className="container demo-api-list">
      <div>

        <div className='header'>
          <NumberInput htmlId='params-user-id' label='UserId' onChange={(v) => dispatcher(["userId", v])}></NumberInput>
          <NumberInput htmlId='params-limit' label='Limit' onChange={(v) => dispatcher(["limit", v])}></NumberInput>
          <NumberInput htmlId='params-offset' label='Offset' onChange={(v) => dispatcher(["offset", v])}></NumberInput>
        </div>

        <div>
          <span>The request will be send to <strong>{listRequestUrl}</strong> if you click `refresh` button. </span>
        </div>

        <div>
          <div>
            <span>Progress</span>
            <span>{progress * 100}%</span>
          </div>
          <div>
            {/* Call the refresh here to resend the request */}
            <Button text='refresh' onClick={() => refresh({ newUrl: listRequestUrl })}></Button>
          </div>
        </div>

      </div>
      {isLoading ? <Loading /> : <Table headers={headers} data={payload?.slice(state.offset ?? undefined, (state.offset === null || state.limit === null ? undefined : state.offset + state.limit)) ?? []} />}
    </section>
  );
}
```


The previous example can be found in `example/`. 
