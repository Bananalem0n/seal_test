import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from 'src/models/admin.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject('ADMIN')
    private readonly adminModel: typeof Admin,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, pass: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ where: { email } });
    if (admin && (await bcrypt.compare(pass, admin.password))) {
      return admin;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(admin: Admin) {
    const payload = { email: admin.email, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async verifyToken(token: string): Promise<Admin> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const admin = await this.adminModel.findOne({
        where: { id: decoded.sub },
      });
      if (!admin) {
        throw new UnauthorizedException('Invalid token');
      }
      return admin;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async createAdmin(email: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await this.adminModel.create({
      email,
      password: hashedPassword,
    });

    return newAdmin;
  }
}
