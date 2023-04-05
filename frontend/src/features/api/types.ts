export type ApiTitle ={
    queryRoute:string
    method:string
    description:string
}
export type ApiQueryParam ={
    param:string
    type:string
    isRequired:boolean
    placeholder:string
    description:string
    example:string

    
}

export type ApiResponseType = {
    code:number
    description:string
}

export type DynamicInputState = {
    [k: string]: string
}

export type DynamicQueryParam = {
    [k: string]: string
}