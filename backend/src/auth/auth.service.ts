import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SiweMessage } from 'siwe';

@Injectable()
export class AuthService {
  private nonces = new Map<string, { nonce: string; expires: number }>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  generateNonce(address: string): string {
    const nonce = Math.random().toString(36).substring(2, 11);
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    this.nonces.set(address.toLowerCase(), { nonce, expires });
    return nonce;
  }

  async verifySignature(address: string, signature: string, message: string): Promise<string> {
    const userAddress = address.toLowerCase();
    const storedNonceObj = this.nonces.get(userAddress);
    
    if (!storedNonceObj || storedNonceObj.expires < Date.now()) {
      throw new UnauthorizedException('Nonce expired or not found');
    }

    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.verify({ signature });
      
      if (fields.data.nonce !== storedNonceObj.nonce) {
        throw new UnauthorizedException('Invalid nonce');
      }

      if (fields.data.address.toLowerCase() !== userAddress) {
        throw new UnauthorizedException('Address mismatch');
      }

      // Cleanup nonce
      this.nonces.delete(userAddress);

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { address: userAddress },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            address: userAddress,
            reputationScore: 100, // Initial user reward points
          },
        });
      }

      // Generate JWT
      return this.jwtService.sign({
        sub: user.id,
        address: userAddress,
      });
    } catch (e) {
      throw new UnauthorizedException(`SIWE validation failed: ${(e as Error).message}`);
    }
  }
}
