class myErrors extends Error{
    constructor(message,statusCode)
    {
        super(message);
        this.stausCode=statusCode;
        this.status=`${statusCode}`.startsWith(4)?"fail":'error';
    }
}

module.exports=myErrors;