import {model,Model,Document,Schema} from 'mongoose';



interface UserAttrs {
    email:string,
    googleId:string,
    name:string,
    picture:string
}

interface UserModel extends Model<UserDoc>{
    build(attrs:UserAttrs):UserDoc;
}

interface UserDoc extends Document{
    email:string,
    googleId:string,
    name:string,
    picture:string,
}

const userSchema = new Schema({
    googleId:{type:String,
        required:true},
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    picture:{
        type:String,
        required:true
    }
   
},{toJSON:{
    transform(doc,ret){
        ret.id=ret._id;
        delete ret._id;
        
        delete ret.__v
    }
}});




userSchema.statics.build = (attrs:UserAttrs)=>{
    return new User(attrs)
}

const User = model<UserDoc,UserModel>('User',userSchema)
export { User };