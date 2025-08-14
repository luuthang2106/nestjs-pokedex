import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async login(loginDto: LoginDto): Promise<any> {
        // Logic for user login
        if (!loginDto.username || !loginDto.password) {
            throw new BadRequestException('Username and password are required');
        }
        const user = await this.userRepository.findOne({ where: { username: loginDto.username } });
        if (!user || user.password !== loginDto.password) {
            throw new BadRequestException('Invalid credentials');
        }

        const token = this.jwtService.sign({
            username: user.username,
            sub: user.id,
        });
        return {
            token
        }
    }

    async register(registerDto: SignupDto): Promise<any> {
        const { username, password } = registerDto;

        if (!username || !password) {
            throw new BadRequestException('Username and password are required');
        }

        const existed = await this.userRepository.exists({ where: { username } });
        if (existed) {
            throw new BadRequestException('Username already exists');
        }

        const user = this.userRepository.create({
            username,
            password,
        });
        await this.userRepository.save(user);

        const token = this.jwtService.sign({
            username: user.username,
            sub: user.id,
        });
        return {
            token
        }
    }

    async verify(token: string): Promise<{ user: User; payload: any }> {
        if (!token) {
            throw new UnauthorizedException('Missing token');
        }
        try {
            // verifyAsync sẽ kiểm tra chữ ký, hạn, issuer/audience (nếu bạn cấu hình)
            const payload = await this.jwtService.verifyAsync(token);
            console.log('JWT payload:', payload);
            const user = await this.userRepository.findOne({ where: { id: payload.sub } });
            console.log('User found:', user);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            return { user, payload };
        } catch (e) {
            console.error('JWT verification error:', e);
            throw new UnauthorizedException('Invalid token');
        }
    }
    private extractTokenFromRequest(req: Request): string | undefined {
        return (req as any).cookies?.token;
    }

    // Verify lấy từ Request (chỉ cookie)
    async verifyFromRequest(req: Request): Promise<{ user: User; payload: any }> {
        const token = this.extractTokenFromRequest(req);
        console.log('Token from request:', token);
        return this.verify(token as string);
    }
}
