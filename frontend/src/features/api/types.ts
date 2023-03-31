export type ApiTitle ={
    queryRoute:string
    method:string
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