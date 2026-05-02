import { Button } from '@/components/atoms/button';
import { cn } from '@/utils/misc';
import { type ComponentProps, useState } from 'react';
import { LogOutIcon, MenuIcon, UserIcon } from 'lucide-react';
import { Section } from '../atoms/section';
import CompanyData from '@/data/company.data';
import { Link } from 'react-router-dom';
import { LogoDimensi } from '@/assets/images';
import { Sheet, SheetContent, SheetTitle } from '../atoms/sheet';
import { useAuth } from '@/contexts/auth.context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar';
import { getInitial } from '@/utils/string';

const Links = CompanyData.menu.main.links;

const Header = ({ className, ...props }: ComponentProps<'header'>) => {
  const { profile, signOut } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className={cn('bg-background shadow-lg', className)} {...props}>
      <Section className="flex flex-row items-center gap-3 py-3 md:gap-9">
        <Button
          variant={'ghost'}
          size={'icon-lg'}
          className="md:hidden"
          onClick={() => setSheetOpen((s) => !s)}
        >
          <MenuIcon />
        </Button>

        <Link to={'/'}>
          <img src={LogoDimensi} alt="" className="w-8" />
        </Link>

        <div className="grow"></div>

        {Links.map((link, i) => (
          <Button key={i} variant={'link'} className="not-md:hidden" asChild>
            <Link to={link.href}>{link.label}</Link>
          </Button>
        ))}

        <div className="grow"></div>

        {profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={'icon'}>
                <Avatar className="*:rounded-lg">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback>{getInitial(profile.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to={'/profil'}>
                  <UserIcon /> Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={signOut}>
                <LogOutIcon /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link to={'/auth/login'}>Login</Link>
          </Button>
        )}
      </Section>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="p-5" side="bottom">
          <SheetTitle visually-hidden="true"></SheetTitle>

          <div className="flex flex-col items-start gap-5">
            {Links.map((link, i) => (
              <Button
                key={i}
                variant={'link'}
                className="text-foreground"
                size={'lg'}
                asChild
              >
                <Link to={link.href} onClick={() => setSheetOpen(false)}>
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
