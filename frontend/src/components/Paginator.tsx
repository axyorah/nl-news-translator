import React from 'react';
import { Link } from 'react-router-dom';

export interface MinimalParams {
    page: number,
    [key: string]: any
}

export interface PaginatorProps<Params extends MinimalParams> {
    baseURL: string,
    params: Params,
    page: number,
    numPages: number
}

function Paginator<Params extends MinimalParams>(
    props: PaginatorProps<Params>
): JSX.Element {

    const { baseURL, params, page, numPages } = props;

    const start = Math.max(1, page - 3);
    const end = Math.min(page + 3, numPages);
    const numCapsules = end - start + 1;

    const makeURL = (
        baseURL: string, params: Params, page: number
    ): string => {
        params.page = page;

        const queryArray: string[] = [];

        Object.keys(params).forEach(key => {
            const val = params[key];
            queryArray.push(`${key}=${val}`);
        });

        return baseURL + '?' + queryArray.join('&')
    };

    return (
        <div className='d-flex justify-content-center mt-5'>

            { page > 1 
                ? <span className='capsule'>
                    <Link 
                        to={makeURL(baseURL, params, page - 1)} 
                        style={{ color: 'white' }}
                    >&lt;</Link>
                </span>
                : null
            }

            { [...Array(numCapsules)].map((v,i) => {
                return (
                    <span key={i} className='capsule'>
                        { i + start === page 
                            ? <b>{i + start}</b>
                            : <Link 
                                to={makeURL(baseURL, params, i + start)} 
                                style={{ color: 'white' }}
                            >{i + 1}</Link>
                        }                            
                    </span>
                );
            }) }

            { page < numPages 
                ? <span className='capsule'>
                    <Link 
                        to={makeURL(baseURL, params, page + 1)} 
                        style={{ color: 'white' }}
                    >&gt;</Link>
                </span>
                : null
            }   

        </div>
    );

};

export default Paginator;