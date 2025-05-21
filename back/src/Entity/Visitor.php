<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\VisitorRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Controller\ProjectAddController;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

use Symfony\Component\Serializer\Attribute\Groups;

use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity(repositoryClass: VisitorRepository::class)]
#[ApiResource(operations: [
    new GetCollection(security: "is_granted('ROLE_ADMIN')"),
    new Get(security: "is_granted('ROLE_ADMIN')"),
    new Post(),
    new Patch(security: "is_granted('ROLE_ADMIN')"),
    new Delete(security: "is_granted('ROLE_ADMIN')"),
], normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['write']],
    forceEager: false // Evite de lancer trop de requêtes SQL
)]

class Visitor
{
    #[Groups('read')]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['read', 'write'])]
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 255)]
    private ?string $name = null;

    #[Groups(['read', 'write'])]
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $lastname = null;

    #[Groups(['read', 'write'])]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['read', 'write'])]
    #[Assert\NotBlank]
    private ?int $phone_number = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['read', 'write'])]
    #[Assert\NotBlank]
    private ?\DateTime $birthdate = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read', 'write'])]
    #[Assert\NotBlank]
    private ?string $axe = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $message = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPhoneNumber(): ?int
    {
        return $this->phone_number;
    }

    public function setPhoneNumber(int $phone_number): static
    {
        $this->phone_number = $phone_number;

        return $this;
    }

    public function getBirthdate(): ?\DateTime
    {
        return $this->birthdate;
    }

    public function setBirthdate(\DateTime $birthdate): static
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    public function getAxe(): ?string
    {
        return $this->axe;
    }

    public function setAxe(string $axe): static
    {
        $this->axe = $axe;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }
}
