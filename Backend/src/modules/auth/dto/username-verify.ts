import {
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class usernameVerify {
    @IsString()
    @MinLength(8)
    @Matches(/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9-_]$/, {
        message: "Invalid username use letters & { -, _ }"
    })
    username: string;
}